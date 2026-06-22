const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('[data-panel]');
const statusDot = document.querySelector('#status-dot');
const syncLine = document.querySelector('#sync-line');
const systemNote = document.querySelector('#system-note');
const refreshButton = document.querySelector('#refresh-button');
const pinButton = document.querySelector('#pin-button');
const clock = document.querySelector('#clock');

let latestSnapshot = null;

function byId(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const element = byId(id);
  if (element) {
    element.textContent = value;
  }
}

function percentText(value) {
  return Number.isFinite(value) ? `${value.toFixed(value % 1 === 0 ? 0 : 1)}%` : '--';
}

function fillProgress(id, value) {
  const element = byId(id);
  if (!element) {
    return;
  }

  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  element.style.width = `${safeValue}%`;
  element.parentElement.classList.toggle('is-empty', !Number.isFinite(value));
}

function currency(value) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 2
  }).format(value);
}

function compactToken(value) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  }

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return String(value);
}

function formatTime(value) {
  if (!value) {
    return '--:--:--';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--:--:--';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

function platformState(platform) {
  if (!platform) {
    return 'idle';
  }

  return platform.status || 'idle';
}

function statusClass(snapshot) {
  if (!snapshot || snapshot.refreshing) {
    return 'syncing';
  }

  const states = Object.values(snapshot.platforms || {}).map(platformState);
  if (states.includes('error')) {
    return 'error';
  }

  if (states.includes('login_required') || states.includes('partial')) {
    return 'warn';
  }

  if (states.every((state) => state === 'ok')) {
    return 'ok';
  }

  return 'idle';
}

function renderStatus(snapshot) {
  const state = statusClass(snapshot);
  statusDot.dataset.state = state;
  refreshButton.classList.toggle('is-spinning', Boolean(snapshot && snapshot.refreshing));
  refreshButton.disabled = Boolean(snapshot && snapshot.refreshing);

  if (!snapshot) {
    syncLine.textContent = '等待同步';
    systemNote.textContent = '本地会话监控';
    return;
  }

  const refreshed = snapshot.refreshedAt ? `上次 ${formatTime(snapshot.refreshedAt)}` : '尚未刷新';
  const next = snapshot.nextRefreshAt ? `下次 ${formatTime(snapshot.nextRefreshAt)}` : '低频刷新';
  syncLine.textContent = snapshot.refreshing ? '同步中' : refreshed;
  systemNote.textContent = `${next} · ${summaryText(snapshot)}`;
}

function summaryText(snapshot) {
  const platforms = snapshot.platforms || {};
  const needLogin = Object.values(platforms).filter((platform) => platform.status === 'login_required').length;
  const errors = Object.values(platforms).filter((platform) => platform.status === 'error').length;

  if (errors) {
    return `${errors} 个平台刷新失败`;
  }

  if (needLogin) {
    return `${needLogin} 个平台待登录`;
  }

  return '后台 5 分钟刷新';
}

function renderOverview(snapshot) {
  const minimax = snapshot.platforms.minimax || {};
  const mimo = snapshot.platforms.mimo || {};
  const deepseek = snapshot.platforms.deepseek || {};

  setText('overview-minimax-value', percentText(minimax.fiveHour && minimax.fiveHour.percentUsed));
  setText(
    'overview-minimax-note',
    minimax.status === 'login_required'
      ? '需要登录'
      : minimax.fiveHour && minimax.fiveHour.resetText
        ? minimax.fiveHour.resetText
        : '5小时限额已用'
  );

  setText('overview-mimo-value', percentText(mimo.usage && mimo.usage.percentUsed));
  setText(
    'overview-mimo-note',
    mimo.status === 'login_required'
      ? '需要登录'
      : mimo.usage && Number.isFinite(mimo.usage.used) && Number.isFinite(mimo.usage.total)
        ? `${compactToken(mimo.usage.used)} / ${compactToken(mimo.usage.total)}`
        : '套餐用量已用'
  );

  setText('overview-deepseek-value', `${currency(deepseek.spendCny)} / ${currency(deepseek.balanceCny)}`);
  setText(
    'overview-deepseek-note',
    deepseek.status === 'login_required' ? '需要登录' : deepseek.period || '消费 / 余额'
  );
}

function renderMiniMax(snapshot) {
  const minimax = snapshot.platforms.minimax || {};
  const five = minimax.fiveHour || {};
  const week = minimax.weekly || {};
  const expiry = minimax.expiry || {};

  setText('minimax-plan', minimax.planName || minimax.statusText || '套餐详情待同步');
  setText('minimax-five-value', percentText(five.percentUsed));
  fillProgress('minimax-five-fill', five.percentUsed);
  setText('minimax-five-note', five.resetText ? `刷新 ${five.resetText}` : '刷新时间待同步');
  setText('minimax-week-value', percentText(week.percentUsed));
  fillProgress('minimax-week-fill', week.percentUsed);
  setText('minimax-week-note', week.resetText ? `刷新 ${week.resetText}` : '刷新时间待同步');
  setText('minimax-expiry', expiry.text ? `套餐 ${expiry.text}` : '套餐到期时间待同步');
  setText('minimax-reminder', expiry.reminder || platformProblem(minimax));
  byId('minimax-reminder').dataset.level = expiry.level || minimax.status || 'unknown';
}

function renderMiMo(snapshot) {
  const mimo = snapshot.platforms.mimo || {};
  const usage = mimo.usage || {};
  const expiry = mimo.expiry || {};

  setText('mimo-plan', mimo.planName || mimo.statusText || '套餐详情待同步');
  setText('mimo-usage-value', percentText(usage.percentUsed));
  fillProgress('mimo-usage-fill', usage.percentUsed);
  setText(
    'mimo-usage-note',
    Number.isFinite(usage.used) && Number.isFinite(usage.total)
      ? `${compactToken(usage.used)} / ${compactToken(usage.total)} Credits`
      : 'Token 用量待同步'
  );
  setText('mimo-expiry', expiry.text ? `套餐 ${expiry.text}` : '套餐到期时间待同步');
  setText('mimo-reminder', expiry.reminder || platformProblem(mimo));
  byId('mimo-reminder').dataset.level = expiry.level || mimo.status || 'unknown';
}

function renderDeepSeek(snapshot) {
  const deepseek = snapshot.platforms.deepseek || {};
  setText('deepseek-period', deepseek.period || deepseek.statusText || '本月消费');
  setText('deepseek-balance', currency(deepseek.balanceCny));
  setText('deepseek-spend', currency(deepseek.spendCny));
  setText('deepseek-status', platformProblem(deepseek) || `同步 ${formatTime(deepseek.refreshedAt)}`);
}

function platformProblem(platform) {
  if (!platform) {
    return '';
  }

  if (platform.status === 'login_required') {
    return platform.statusText || '需要登录';
  }

  if (platform.status === 'error') {
    return platform.lastError ? `${platform.statusText}: ${platform.lastError}` : platform.statusText;
  }

  if (platform.status === 'partial') {
    return platform.statusText || '部分数据未识别';
  }

  return '';
}

function renderSnapshot(snapshot) {
  latestSnapshot = snapshot;
  renderStatus(snapshot);

  if (!snapshot || !snapshot.platforms) {
    return;
  }

  renderOverview(snapshot);
  renderMiniMax(snapshot);
  renderMiMo(snapshot);
  renderDeepSeek(snapshot);
}

function setActiveTab(tabName) {
  tabs.forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.tab === tabName);
  });
  panels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.panel === tabName);
  });
}

function renderClock() {
  if (clock) {
    clock.textContent = formatTime(new Date().toISOString());
  }
}

function wireEvents() {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
  });

  document.querySelectorAll('[data-open-platform]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.openPlatform;
      window.tokenBI && window.tokenBI.openPlatform(key);
    });
  });

  refreshButton.addEventListener('click', () => {
    if (!window.tokenBI) {
      renderSnapshot(latestSnapshot);
      return;
    }

    window.tokenBI.refreshNow().then(renderSnapshot).catch(() => {});
  });

  pinButton.addEventListener('click', () => {
    if (!window.tokenBI) {
      return;
    }

    window.tokenBI.toggleAlwaysOnTop().then((isPinned) => {
      pinButton.classList.toggle('is-active', isPinned);
    });
  });

  document.querySelector('#minimize-button').addEventListener('click', () => {
    window.tokenBI && window.tokenBI.minimize();
  });

  document.querySelector('#close-button').addEventListener('click', () => {
    window.tokenBI && window.tokenBI.close();
  });
}

function bootstrap() {
  wireEvents();
  renderClock();
  setInterval(renderClock, 1000);

  const api = window.tokenBI;
  if (!api) {
    renderSnapshot({
      refreshedAt: new Date().toISOString(),
      refreshing: false,
      nextRefreshAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      platforms: {
        minimax: {
          status: 'ok',
          planName: 'Example Plan',
          fiveHour: { percentUsed: 12, resetText: '约 4 小时后重置' },
          weekly: { percentUsed: 18, resetText: '约 5 天后重置' },
          expiry: { text: '示例到期日 2099-12-31', level: 'ok', reminder: '' }
        },
        mimo: {
          status: 'ok',
          planName: 'Example Monthly Plan',
          usage: { percentUsed: 24, used: 2400000, total: 10000000 },
          expiry: { text: '有效期至 2099-12-31 23:59 (UTC)', level: 'ok', reminder: '' }
        },
        deepseek: {
          status: 'ok',
          balanceCny: 100.0,
          spendCny: 10.0,
          period: '示例月份消费'
        }
      }
    });
    return;
  }

  api.readNow().then(renderSnapshot).catch(() => renderStatus(null));
  api.onSnapshot(renderSnapshot);
}

bootstrap();
