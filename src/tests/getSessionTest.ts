import { AuthService } from '../modules/auth/auth.services';

async function Yotest() {
  const session = await AuthService.getSessionFromRefreshToken('ashirvad@gmail.com');
  console.log('session :', session);
}

Yotest();
