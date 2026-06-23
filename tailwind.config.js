/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Claude 风格色彩系统：奶油白底 + 暖黑文本 + 陶土橙强调
      colors: {
        // 主色调
        ink: '#141413',        // 暖黑，主文本（带暖调，非纯黑）
        paper: '#faf9f5',      // 奶油白，背景（纸张质感）
        fog: '#e8e6dc',        // 浅灰米，卡片底色
        mid: '#b0aea5',        // 中灰，次要元素
        // Claude 强调色
        clay: {
          DEFAULT: '#d97757',  // 陶土橙，主强调色（Claude 标志性）
          light: '#e89378',    // 浅陶土橙
          dark: '#c25e3d',     // 深陶土橙
        },
        sage: '#788c5d',       // 橄榄绿，辅助点缀
        slate: '#6a9bcc',      // 雾蓝，辅助点缀
      },
      fontFamily: {
        // Claude 字体系统：衬线标题 + 无衬线正文（禁用 Inter/Roboto）
        serif: ['"Lora"', '"Source Serif Pro"', 'Georgia', 'serif'],
        sans: ['"Poppins"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(20, 20, 19, 0.08)',
        warm: '0 12px 40px rgba(217, 119, 87, 0.12)',
        paper: '0 2px 12px rgba(20, 20, 19, 0.04), 0 8px 32px rgba(20, 20, 19, 0.06)',
      },
      backdropBlur: {
        xs: '6px',
      },
      keyframes: {
        // 用于底部滚动按钮的轻微漂浮节奏
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        // 陶土橙脉冲，用于强调元素
        pulseClay: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        // 纸张纹理微动
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(2px, -2px)' },
        },
      },
      animation: {
        float: 'float 1.5s ease-in-out infinite',
        pulseClay: 'pulseClay 2.4s ease-in-out infinite',
        drift: 'drift 8s ease-in-out infinite',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
