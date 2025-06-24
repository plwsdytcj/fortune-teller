import { createI18n } from 'vue-i18n';

// 1. 创建语言包 (通常会放在单独的 .json 文件中)
const messages = {
  en: {
    message: {
      hello: 'Hello, World!',
      divination: 'Divination',
      divination_types: 'Divination Types',
      select_a_type: 'Please select a divination type below.',
      birthday: 'Birthday',
      lunar_date: 'Lunar Date',
      surname: 'Surname',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      additional_info: 'Additional Info',
      name: 'Name',
      dream_prompt: 'Please enter your dream',
      plum_flower_prompt: 'Please enter two random numbers between 0-1000',
      num1: 'Number 1',
      num2: 'Number 2',
      fate_prompt_1: 'Fate is destined, happiness is your own.',
      fate_prompt_2: 'Want to know if you have a destiny with them? Enter "Name 1" and "Name 2", then click "Predict".',
      fate_prompt_3: 'For example, enter two names, then click predict to see your destiny.',
      name1: 'Name 1',
      name2: 'Name 2',
      show_result: 'Show Result',
      show_result_loading: 'Click to open result page',
      submit: 'Submit',
      submitting: 'Submitting...',
      about: 'About',
      result_title: 'Divination Result',
      enter_a_name: 'Enter a name',
      tarot_prompt_placeholder: 'What are my finances like?',
    }
  },
  zh: {
    message: {
      hello: '你好，世界！',
      divination: '占卜',
      divination_types: '占卜类型',
      select_a_type: '请在下方选择一个占卜类型。',
      birthday: '生日',
      lunar_date: '农历',
      surname: '姓氏',
      gender: '性别',
      male: '男',
      female: '女',
      additional_info: '附加',
      name: '姓名',
      dream_prompt: '请输入你的梦境',
      plum_flower_prompt: '请随机输入两个 0-1000 的数字',
      num1: '数字一',
      num2: '数字二',
      fate_prompt_1: '缘分是天定的，幸福是自己的。',
      fate_prompt_2: '想知道你和 ta 有没有缘分呢，编辑"姓名1" "姓名2"，然后点击"一键预测"。',
      fate_prompt_3: '如郭靖 黄蓉，然后点击一键预测。 就能查看你和 ta 的缘分了。',
      name1: '姓名1',
      name2: '姓名2',
      show_result: '查看占卜结果',
      show_result_loading: '点击打开占卜结果页面',
      submit: '占卜',
      submitting: '正在占卜中...',
      about: '关于',
      result_title: '占卜结果',
      enter_a_name: '请输入姓名',
      tarot_prompt_placeholder: '我的财务状况如何',
    }
  }
};

// 2. 自动检测浏览器语言
const getBrowserLang = () => {
  const lang = navigator.language || navigator.userLanguage;
  if (lang.toLowerCase().startsWith('zh')) {
    return 'zh';
  }
  // 默认返回英文
  return 'en';
};

const userLang = getBrowserLang();


// 3. 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 必须设置为 false，才能在 Vue 3 的 Composition API 中使用
  locale: userLang, // 设置默认语言
  fallbackLocale: 'en', // 如果当前语言缺少某个翻译，则回退到英文
  messages, // 挂载语言包
});

export default i18n; 