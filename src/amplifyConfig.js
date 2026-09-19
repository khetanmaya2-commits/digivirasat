import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_dm2CWkQzs',
      userPoolClientId: '72usmdp3ik7oem0nthdo5fq79f',
      loginWith: {
        email: true,
      },
    },
  },
});