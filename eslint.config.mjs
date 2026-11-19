import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const banned = 'Local component state is banned. Put it in a Redux slice (src/store) and use useAppSelector / useAppDispatch.'

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  {
    rules: {
      'no-restricted-imports': ['error', { paths: [{ name: 'react', importNames: ['useState', 'useReducer'], message: banned }] }],
      'no-restricted-syntax': [
        'error',
        { selector: "MemberExpression[object.name='React'][property.name=/^(useState|useReducer)$/]", message: banned },
      ],
    },
  },
]

export default config
