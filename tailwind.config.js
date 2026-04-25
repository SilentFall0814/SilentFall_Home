/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // 统一作品页使用的浅灰底与高对比黑白关系。
      colors: {
        ink: '#090909',
        mist: '#f5f5f3',
        fog: '#e6e6e3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        xs: '6px',
      },
      keyframes: {
        // 用于底部滚动按钮的轻微漂浮节奏。
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
      },
      animation: {
        float: 'float 1.5s ease-in-out infinite',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
