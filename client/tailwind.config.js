module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minWidth: {
        72: '18rem',
      },
      gridTemplateColumns: {
        table: '60px 1fr 2fr repeat(2, 1fr) 60px',
        page: '240px 1fr',
        'operation-time': '60px auto 50px 1fr 14px 1fr',
      },
    },
    fontFamily: {
      sans: ["'Roboto'", 'sans-serif'],
    },
    fontSize: {
      h1: ['3.433125rem', '4rem'],
      h2: ['2.746875rem', '3.875rem'],
      h3: ['2.1975rem', '2.875rem'],
      h4: ['1.758125rem', '2.3125rem'],
      h5: ['1.40625rem', '1.875rem'],
      body: ['1.125rem', '1.625rem'],
      'body-sm': ['0.9rem', '1.375rem'],
      'body-xs': ['0.72rem', '1.0875rem'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: {
        DEFAULT: '#FFFFFF',
      },
      blue: {
        DEFAULT: '#E0E9FF',
        light: '#F1F4FB',
      },
      red: {
        DEFAULT: '#F05B4C',
        light: '#FFACA4',
      },
      purple: {
        DEFAULT: '#364294',
        light: '#485FC0',
      },
      black: {
        DEFAULT: '#393B3D',
      },
      grey: {
        DEFAULT: '#808080',
        light: '#B6B6B6',
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['hover', 'last'],
      margin: ['last'],
    },
  },
  plugins: [],
};
