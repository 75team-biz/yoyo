/**
 * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
 *                                如果想忽略结尾边界上的调用，传入{trailing: false}
 * @return {function}             返回客户调用函数
 */
function throttle (func, wait, options) {
  var context, args, result;
  var timeout = null;
  // 上次执行时间点
  var previous = 0;
  if (!options) options = {};
  // 延迟执行函数
  var later = function() {
    // 若设定了开始边界不执行选项，上次执行时间始终为0
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = new Date().getTime();
    // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
    if (!previous && options.leading === false) previous = now;
    // 延迟执行时间间隔
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
    // remaining大于时间窗口wait，表示客户端系统时间被调整过
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    //如果延迟执行不存在，且没有设定结尾边界不执行选项
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

// 页面滚动时间，将 sidebar 固定在页面左侧
function windowScroll() {
    var sidebar = document.querySelector('.sidebar');
    var cls = sidebar.className;
    if(window.pageYOffset > 50){
        if( cls.indexOf('fix-sidebar') == -1){
            sidebar.className = cls + ' fix-sidebar';
        }
    }else {
        sidebar.className = cls.replace(/\bfix-sidebar\b/g, '');
    }
    var activeEles = document.querySelector('.sidebar a.active');
    activeEles.className = activeEles.className.replace(/\bactive\b/g, '');
    var sections = Array.prototype.slice.call(document.querySelectorAll('.content > section'));
    var currentId = sections.filter(function(s){
            return s.getBoundingClientRect().top > 0
        })[0].id;
    var currentEle = document.querySelector('[href="#'+currentId+'"]');
    currentEle.className = currentEle.className + ' active';
}

// 退出操作
function logout() {
    var signedEle = document.querySelector('.signed');
    var unsignedEle = document.querySelector('.unsigned');
    signedEle.style.display = "none";
    unsignedEle.style.display = "block";
}

// 导航点击操作
function sidebarClick(e) {
    if(e.target.tagName === 'A') {
        var activeEle = document.querySelector('.sidebar .active');
        activeEle.className = activeEle.className.replace(/\bactive\b/g, '');
        e.target.className = e.target.className + ' active';
    }
}

//显示代码
function showcode(e, specifyNode) {
    var code = '';
    if(specifyNode){
        code = document.querySelector('.'+specifyNode).outerHTML;
    }else {
        code = e.parentElement.previousElementSibling.outerHTML;
    }
    var codeEle = e.parentElement.querySelector('pre code');
    code = beautify_HTML(code);
    codeEle.innerHTML = Prism.highlight(code, Prism.languages.markup);
    codeEle.parentElement.style.display = "block";// 显示代码
    e.style.display = "none";// 隐藏 showcode button
    e.nextElementSibling.style.display = "inline-block";// 显示 hidecode button
    e.nextElementSibling.nextElementSibling.style.display = "inline-block";// 显示 copycode button
}
//隐藏代码
function hidecode(e) {
    e.style.display = "none";// 隐藏 hidecode button
    e.previousElementSibling.style.display = "block";// 显示 showcode button
    e.nextElementSibling.style.display = "none";// 隐藏 copycode button
    e.nextElementSibling.nextElementSibling.style.display = "none";// 隐藏代码
}
//复制代码
function copycode(e, specifyNode) {
    var code = '';
    if(specifyNode){
        code = document.querySelector('.'+specifyNode).outerHTML;
    }else {
        code = e.parentElement.previousElementSibling.outerHTML;
    }
    code = beautify_HTML(code);
    copyTextToClipboard(code);
}

//显示dialog
function showDialog(e) {
    e.nextElementSibling.style.display = 'block';
}
function hideDialog(e) {
    targetClass = e.target.className;
    if(targetClass.indexOf('dialog-confirm')>-1 || targetClass.indexOf('dialog-cancel')>-1 || targetClass.indexOf('close')>-1){
        document.querySelectorAll('.dialog-box').forEach(function(db){
            db.style.display = 'none';
        });
    }
}

function bindEvent(ele, events, func) {
    if(document.addEventListener) {
        ele.addEventListener(events, func, false);
    }else if(document.attachEvent) {
        ele.attachEvent(events, func);
    }
}

window.alert = function(msg) {
    var alertBox = document.querySelector('.yoyo-alert');
    alertBox.querySelector('.msg-wrap').innerHTML = msg;
    alertBox.style.display = 'block';
}

window.onload = function() {
    // 代码操作
    var codeWrapEles = Array.prototype.slice.call(document.querySelectorAll('.code-wrap'));
    codeWrapEles.forEach(function(cw){
        var specifyClasses = cw.dataset.specify;
        specifyClasses = (specifyClasses) ? ',\'' + specifyClasses + '\'' : '';
        cw.innerHTML = '<button class="btn showcode" onclick="showcode(this'+specifyClasses+')">show code</button>'
                + '<button class="btn hidecode" onclick="hidecode(this)">hide code</button>'
                + '<button class="btn copycode" onclick="copycode(this'+specifyClasses+')">copy</button>'
                + '<pre class="language-markup"><code class="language-markup"></code></pre>';
    });
    // 事件绑定
    bindEvent(document, 'scroll',throttle(windowScroll, 500));
    bindEvent(document.querySelector('.sidebar'), 'click', sidebarClick);
    bindEvent(document.querySelector('.logout'), 'click', logout);
    bindEvent(document.querySelector('#dialog'), 'click', hideDialog);
    bindEvent(document.querySelector('#alert'), 'click', hideDialog);
    bindEvent(document.querySelector('#warn'), 'click', hideDialog);
    bindEvent(document.querySelector('#confirm'), 'click', hideDialog);
    bindEvent(document.querySelector('.yoyo-alert'), 'click', hideDialog);
    //初始执行一次计算sidebar的位置
    windowScroll();
}
