const { BrowserWindow, session } = require('electron');

const PAGE_LOAD_TIMEOUT_MS = 30000;
const READY_WAIT_MS = 8000;
const CAPTURE_TEXT_LIMIT = 160000;
const DAY_MS = 24 * 60 * 60 * 1000;

const PLATFORMS = {
  minimax: {
    id: 'minimax',
    name: 'MiniMax',
    partition: 'persist:tokenbi-minimax',
    urls: {
      usage: 'https://platform.minimaxi.com/console/usage',
      detail: 'https://platform.minimaxi.com/console/plan'
    },
    readyText: ['套餐用量', '我的用量', '5 h限额', '5小时限额'],
    dataReadyPatterns: [/已(?:用|使用)\s*[\d.]+\s*%/]
  },
  mimo: {
    id: 'mimo',
    name: 'MiMo',
    partition: 'persist:tokenbi-mimo',
    urls: {
      usage: 'https://platform.xiaomimimo.com/console/plan-manage'
    },
    readyText: ['套餐使用情况', '当前套餐用量', 'Token Plan'],
    dataReadyPatterns: [/[\d,]{3,}\s*\/\s*[\d,]{3,}/, /已使用\s*[\d.]+\s*%/]
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    partition: 'persist:tokenbi-deepseek',
    urls: {
      usage: 'https://platform.deepseek.com/usage'
    },
    readyText: ['用量信息', '充值余额', '每月用量'],
    dataReadyPatterns: [/充值余额[\s\S]{0,80}[¥￥]\s*[\d,]+(?:\.\d+)?/, /消费[\s\S]{0,80}[¥￥]\s*[\d,]+(?:\.\d+)?/]
  }
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function compact(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function oneLine(value) {
  return compact(value).replace(/\n+/g, ' ');
}

function linesFromText(text) {
  return compact(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function numberFromText(value) {
  const match = String(value || '').match(/-?[\d,]+(?:\.\d+)?/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[0].replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function percentList(text) {
  return [...String(text || '').matchAll(/已(?:用|使用)\s*([\d.]+)\s*%/g)]
    .map((match) => Number(match[1]))
    .filter((value) => Number.isFinite(value));
}

function clampPercent(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.max(0, Math.min(100, value));
}

function findLineAfter(text, anchorPatterns, wantedPattern, lookAhead = 6) {
  const lines = linesFromText(text);

  for (let index = 0; index < lines.length; index += 1) {
    if (!anchorPatterns.some((pattern) => pattern.test(lines[index]))) {
      continue;
    }

    for (let offset = 0; offset < lookAhead && index + offset < lines.length; offset += 1) {
      const line = lines[index + offset];
      const match = line.match(wantedPattern);
      if (match) {
        return oneLine(match[1] || match[0]);
      }
    }
  }

  return null;
}

function findResetText(text, anchorPatterns) {
  const byLine = findLineAfter(text, anchorPatterns, /([\u4e00-\u9fa5\d\s]+后重置)/);
  if (byLine) {
    return byLine;
  }

  for (const pattern of anchorPatterns) {
    const anchor = String(text || '').search(pattern);
    if (anchor < 0) {
      continue;
    }

    const segment = String(text).slice(anchor, anchor + 220);
    const match = segment.match(/([\u4e00-\u9fa5\d\s]+后重置)/);
    if (match) {
      return oneLine(match[1]);
    }
  }

  return null;
}

function findDateTextNear(text, labels) {
  const normalized = compact(text);

  for (const label of labels) {
    const index = normalized.indexOf(label);
    if (index < 0) {
      continue;
    }

    const segment = normalized.slice(index, index + 180);
    const dateMatch = segment.match(
      /(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?(?:\s*\([^)]+\))?/i
    );
    if (dateMatch) {
      return oneLine(`${label} ${dateMatch[0]}`);
    }
  }

  return null;
}

function parseDateFromText(text) {
  const match = String(text || '').match(
    /(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/i
  );
  if (!match) {
    return null;
  }

  const [, year, month, day, hour = '23', minute = '59', second = '59'] = match;
  const y = Number(year);
  const m = Number(month) - 1;
  const d = Number(day);
  const h = Number(hour);
  const min = Number(minute);
  const sec = Number(second);

  if (/\bUTC\b/i.test(String(text))) {
    return new Date(Date.UTC(y, m, d, h, min, sec));
  }

  return new Date(y, m, d, h, min, sec);
}

function expiryState(text) {
  const date = parseDateFromText(text);
  if (!date || Number.isNaN(date.getTime())) {
    return {
      text: text || '未识别到期时间',
      iso: null,
      level: 'unknown',
      reminder: ''
    };
  }

  const diff = date.getTime() - Date.now();
  const level = diff <= 0 ? 'expired' : diff <= DAY_MS ? 'soon' : 'ok';
  const reminder =
    level === 'expired' ? '套餐已到期' : level === 'soon' ? '套餐将在 24 小时内到期' : '';

  return {
    text,
    iso: date.toISOString(),
    level,
    reminder
  };
}

function findPlanName(text, patterns) {
  const lines = linesFromText(text);

  for (const pattern of patterns) {
    const line = lines.find((candidate) => pattern.test(candidate));
    if (line) {
      return oneLine(line);
    }
  }

  return '';
}

function findCurrencyNear(text, labels) {
  const normalized = compact(text);

  for (const label of labels) {
    const index = normalized.indexOf(label);
    if (index < 0) {
      continue;
    }

    const segment = normalized.slice(index, index + 220);
    const match = segment.match(/[¥￥]\s*([\d,]+(?:\.\d+)?)/) || segment.match(/([\d,]+(?:\.\d+)?)\s*CNY/i);
    if (match) {
      return numberFromText(match[1]);
    }
  }

  return null;
}

function cleanErrorMessage(error) {
  return String(error && error.message ? error.message : error || '未知错误')
    .replace(/https?:\/\/\S+/g, '[url]')
    .slice(0, 180);
}

function looksLoggedOut(capture, expectedTexts) {
  const url = String(capture.url || '').toLowerCase();
  const text = compact(capture.text);

  if (expectedTexts.some((keyword) => text.includes(keyword))) {
    return false;
  }

  if (/login|signin|sign-in|auth|passport|sso/.test(url)) {
    return true;
  }

  return /登录|登陆|sign in|log in/i.test(text) && !/套餐|用量|余额|消费/.test(text);
}

async function loadWithTimeout(window, url) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(new Error('页面加载超时')), PAGE_LOAD_TIMEOUT_MS);
  });

  const result = await Promise.race([
    window.loadURL(url).then(() => null).catch((error) => error),
    timeout
  ]);
  clearTimeout(timer);

  return result;
}

async function waitForReadyText(window, keywords) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < READY_WAIT_MS) {
    const text = await window.webContents
      .executeJavaScript('document.body ? document.body.innerText : ""', true)
      .catch(() => '');

    if (!keywords.length || keywords.some((keyword) => String(text).includes(keyword))) {
      return;
    }

    await sleep(800);
  }
}

async function waitForDataReady(window, config) {
  const patterns = config.dataReadyPatterns || [];
  const startedAt = Date.now();
  let sawPageShell = false;

  while (Date.now() - startedAt < 22000) {
    const text = await window.webContents
      .executeJavaScript('document.body ? document.body.innerText : ""', true)
      .catch(() => '');

    if (config.readyText.some((keyword) => String(text).includes(keyword))) {
      sawPageShell = true;
    }

    if (sawPageShell && (!patterns.length || patterns.every((pattern) => pattern.test(String(text))))) {
      await sleep(900);
      return;
    }

    await sleep(900);
  }
}

async function captureDom(window) {
  return window.webContents.executeJavaScript(
    `(() => {
      const compact = (value) => String(value || '')
        .replace(/\\u00a0/g, ' ')
        .replace(/[ \\t]+/g, ' ')
        .trim();
      const links = Array.from(document.querySelectorAll('a'))
        .slice(0, 140)
        .map((link) => ({
          text: compact(link.innerText || link.textContent || link.getAttribute('aria-label') || ''),
          href: link.href || ''
        }))
        .filter((link) => link.text || link.href);

      return {
        url: location.href,
        title: document.title || '',
        text: (document.body ? document.body.innerText : '').slice(0, ${CAPTURE_TEXT_LIMIT}),
        links
      };
    })()`,
    true
  );
}

function basePlatformState(config, overrides = {}) {
  return {
    id: config.id,
    name: config.name,
    status: 'idle',
    statusText: '等待刷新',
    refreshedAt: null,
    lastError: '',
    ...overrides
  };
}

function parseMiniMax(usageCapture, detailCapture) {
  if (looksLoggedOut(usageCapture, PLATFORMS.minimax.readyText)) {
    return basePlatformState(PLATFORMS.minimax, {
      status: 'login_required',
      statusText: '需要登录 MiniMax'
    });
  }

  const usageText = usageCapture.text || '';
  const detailText = detailCapture && !looksLoggedOut(detailCapture, ['套餐详情', 'TokenPlan', '下次续费日'])
    ? detailCapture.text
    : '';
  const percents = percentList(usageText);
  const fiveHour = clampPercent(percents[0]);
  const weekly = clampPercent(percents[1]);
  const expiryText =
    findDateTextNear(detailText, ['下次续费日', '有效期至', '套餐到期', '到期时间']) ||
    findDateTextNear(usageText, ['下次续费日', '有效期至', '套餐到期', '到期时间']);

  return basePlatformState(PLATFORMS.minimax, {
    status: fiveHour === null && weekly === null ? 'partial' : 'ok',
    statusText: fiveHour === null && weekly === null ? '已登录，未识别用量' : '在线',
    refreshedAt: new Date().toISOString(),
    planName: findPlanName(detailText || usageText, [/TokenPlan/i, /月度会员/, /年度会员/]),
    fiveHour: {
      label: '5小时限额',
      percentUsed: fiveHour,
      resetText: findResetText(usageText, [/5\s*h限额/i, /5小时限额/, /5\s*h/]) || '未识别重置时间'
    },
    weekly: {
      label: '周限额',
      percentUsed: weekly,
      resetText: findResetText(usageText, [/周限额/]) || '未识别重置时间'
    },
    expiry: expiryState(expiryText)
  });
}

function parseMiMo(capture) {
  if (looksLoggedOut(capture, PLATFORMS.mimo.readyText)) {
    return basePlatformState(PLATFORMS.mimo, {
      status: 'login_required',
      statusText: '需要登录 MiMo'
    });
  }

  const text = capture.text || '';
  const usagePair = text.match(/([\d,]{3,})\s*\/\s*([\d,]{3,})/);
  const percentMatch = text.match(/已使用\s*([\d.]+)\s*%/);
  const percent = percentMatch ? clampPercent(Number(percentMatch[1])) : null;
  const expiryText = findDateTextNear(text, ['有效期至', '套餐到期', '到期时间']);

  return basePlatformState(PLATFORMS.mimo, {
    status: percent === null ? 'partial' : 'ok',
    statusText: percent === null ? '已登录，未识别用量' : '在线',
    refreshedAt: new Date().toISOString(),
    planName: findPlanName(text, [/Standard.*套餐/i, /月度套餐/, /年度套餐/, /Token Plan/i]),
    usage: {
      percentUsed: percent,
      used: usagePair ? numberFromText(usagePair[1]) : null,
      total: usagePair ? numberFromText(usagePair[2]) : null
    },
    expiry: expiryState(expiryText)
  });
}

function parseDeepSeek(capture) {
  if (looksLoggedOut(capture, PLATFORMS.deepseek.readyText)) {
    return basePlatformState(PLATFORMS.deepseek, {
      status: 'login_required',
      statusText: '需要登录 DeepSeek'
    });
  }

  const text = capture.text || '';
  const allAmounts = [...text.matchAll(/[¥￥]\s*([\d,]+(?:\.\d+)?)/g)]
    .map((match) => numberFromText(match[1]))
    .filter((value) => value !== null);
  const balance = findCurrencyNear(text, ['充值余额', '余额']) ?? allAmounts[0] ?? null;
  const spend = findCurrencyNear(text, ['本月消费', '六月消费', '月消费', '消费金额']) ?? allAmounts[1] ?? null;
  const period = oneLine((text.match(/[\u4e00-\u9fa5一二三四五六七八九十]+月消费[^\n]*/) || [])[0] || '本月消费');

  return basePlatformState(PLATFORMS.deepseek, {
    status: balance === null && spend === null ? 'partial' : 'ok',
    statusText: balance === null && spend === null ? '已登录，未识别金额' : '在线',
    refreshedAt: new Date().toISOString(),
    balanceCny: balance,
    spendCny: spend,
    period
  });
}

class TokenMonitor {
  constructor() {
    this.snapshot = {
      refreshedAt: null,
      refreshing: false,
      platforms: {
        minimax: basePlatformState(PLATFORMS.minimax),
        mimo: basePlatformState(PLATFORMS.mimo),
        deepseek: basePlatformState(PLATFORMS.deepseek)
      }
    };
    this.pendingRefresh = null;
    this.authWindows = new Map();
  }

  getSnapshot() {
    return clone(this.snapshot);
  }

  ensureSession(config) {
    const platformSession = session.fromPartition(config.partition);
    platformSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
      callback(false);
    });
    return platformSession;
  }

  async capturePage(config, url, options = {}) {
    const page = new BrowserWindow({
      show: false,
      width: 1280,
      height: 900,
      webPreferences: {
        session: this.ensureSession(config),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        backgroundThrottling: true
      }
    });

    page.webContents.setAudioMuted(true);

    try {
      const loadError = await loadWithTimeout(page, url);
      await waitForReadyText(page, config.readyText);
      if (options.waitForData !== false) {
        await waitForDataReady(page, config);
      }
      const capture = await captureDom(page);
      capture.loadError = loadError ? cleanErrorMessage(loadError) : '';
      return capture;
    } finally {
      if (!page.isDestroyed()) {
        page.destroy();
      }
    }
  }

  async collectMiniMax() {
    const config = PLATFORMS.minimax;
    const usageCapture = await this.capturePage(config, config.urls.usage);

    let detailCapture = null;
    const detailFromLink = (usageCapture.links || []).find((link) => /套餐详情|订阅/.test(link.text));
    const detailUrl = (detailFromLink && detailFromLink.href) || config.urls.detail;

    try {
      detailCapture = await this.capturePage(config, detailUrl, { waitForData: false });
    } catch (_error) {
      detailCapture = null;
    }

    return parseMiniMax(usageCapture, detailCapture);
  }

  async collectMiMo() {
    const config = PLATFORMS.mimo;
    const capture = await this.capturePage(config, config.urls.usage);
    return parseMiMo(capture);
  }

  async collectDeepSeek() {
    const config = PLATFORMS.deepseek;
    const capture = await this.capturePage(config, config.urls.usage);
    return parseDeepSeek(capture);
  }

  async refreshAll() {
    if (this.pendingRefresh) {
      return this.pendingRefresh;
    }

    this.pendingRefresh = this.runRefresh().finally(() => {
      this.pendingRefresh = null;
    });

    return this.pendingRefresh;
  }

  async runRefresh() {
    this.snapshot.refreshing = true;

    const collectors = [
      ['minimax', () => this.collectMiniMax()],
      ['mimo', () => this.collectMiMo()],
      ['deepseek', () => this.collectDeepSeek()]
    ];

    const nextPlatforms = { ...this.snapshot.platforms };

    for (const [key, collect] of collectors) {
      const config = PLATFORMS[key];
      try {
        nextPlatforms[key] = await collect();
      } catch (error) {
        nextPlatforms[key] = basePlatformState(config, {
          status: 'error',
          statusText: '刷新失败',
          refreshedAt: new Date().toISOString(),
          lastError: cleanErrorMessage(error)
        });
      }
    }

    this.snapshot = {
      refreshedAt: new Date().toISOString(),
      refreshing: false,
      platforms: nextPlatforms
    };

    return this.getSnapshot();
  }

  openPlatform(key) {
    const config = PLATFORMS[key];
    if (!config) {
      throw new Error(`Unknown platform: ${key}`);
    }

    const existing = this.authWindows.get(key);
    if (existing && !existing.isDestroyed()) {
      existing.focus();
      return;
    }

    const authWindow = new BrowserWindow({
      width: 1280,
      height: 860,
      minWidth: 980,
      minHeight: 720,
      title: `${config.name} 登录 / 控制台`,
      autoHideMenuBar: true,
      webPreferences: {
        session: this.ensureSession(config),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });

    this.authWindows.set(key, authWindow);
    authWindow.on('closed', () => {
      this.authWindows.delete(key);
    });
    authWindow.loadURL(config.urls.usage);
  }
}

function createTokenMonitor() {
  return new TokenMonitor();
}

module.exports = {
  createTokenMonitor,
  PLATFORMS
};
