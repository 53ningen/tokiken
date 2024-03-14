import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F06071',
        secondary: '#F4C2C3',
        tokimekiblue: '#69B0CB',
        tokimekipurple: '#8E5AB4',
        tokimekired: '#D75750',
        tokimekipink: '#E292B4',
        tokimekilemon: '#E9CC48',
        tokimekigreen: '#5D9767',
        tokimekiorange: '#F5A623',
      },
    },
  },
  plugins: [],
}
export default config
