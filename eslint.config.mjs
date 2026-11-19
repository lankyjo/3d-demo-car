import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const banned = 'Local component state is banned. Put it in a Redux slice (src/store) and use useAppSelector / useAppDispatch.'

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  {
    rules: {
      'no-restricted-imports': ['error', { paths: [
        { name: 'react', importNames: ['useState', 'useReducer'], message: banned },
        { name: 'react-redux', importNames: ['useSelector', 'useDispatch'], message: 'Use the typed useAppSelector / useAppDispatch from @/store/hooks.' },
      ] }],
      'no-restricted-syntax': [
        'error',
        { selector: "MemberExpression[object.name='React'][property.name=/^(useState|useReducer)$/]", message: banned },
      ],
    },
  },
  // The one place allowed to wrap react-redux's untyped hooks.
  { files: ['src/store/hooks.ts'], rules: { 'no-restricted-imports': 'off' } },
]

export default config
