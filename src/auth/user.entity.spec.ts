import { User } from './user.entity';
describe(`UserEntity`, () => {
  let user: User;
  beforeEach(() => {
    user = new User();
    (user.password = 'userpass'), (user.username = 'richard');
  });
  describe('hashPassword', () => {
    it(`Should hash the password`, async () => {
      await user.hashpassword();
      expect(user.password).not.toEqual('userpass');
    });
  });
  describe(`comparePassword`, () => {
    it(`Should return true if passwords are same`, async () => {
      await user.hashpassword();
      const isSame = await user.comparePassword('userpass', user.password);
      expect(isSame).toBeTruthy();
    });
    it(`Should return false if passwords aren't same`, async () => {
      await user.hashpassword();
      const isSame = await user.comparePassword('foo', user.password);
      expect(isSame).toBeFalsy();
    });
  });
});
