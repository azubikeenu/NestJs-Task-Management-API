class FriendList {
  friends: string[] = [];

  addFriends(name: string): void {
    this.friends.push(name);
    this.annouceNewFriend(name);
  }
  annouceNewFriend(name: string): void {
    global.console.log(`Hello ${name}`);
  }

  removeFriend(name: string): void {
    const previousLength = this.friends.length;
    this.friends = this.friends.filter((f) => f !== name);
    const newLength = this.friends.length;
    if (newLength === previousLength)
      throw new Error(`${name} not in friendList`);
  }
}

describe('FriendList', () => {
  let friendList: FriendList;

  beforeEach(() => {
    friendList = new FriendList();
  });

  it(`Should initialize a new class`, () => {
    expect(friendList).toBeDefined();
    expect(friendList.friends.length).toBe(0);
  });

  it(`Should add a new friend to the friendList`, () => {
    friendList.addFriends('richard');
    expect(friendList.friends.length).toEqual(1);
  });

  it(`Should annouce a new friend anytime a friend is added`, () => {
    friendList.annouceNewFriend = jest.fn();
    expect(friendList.annouceNewFriend).not.toHaveBeenCalled();
    friendList.addFriends('Richard');
    expect(friendList.annouceNewFriend).toHaveBeenCalled();
    expect(friendList.annouceNewFriend).toHaveBeenCalledWith('Richard');
  });

  describe(`Remove friend`, () => {
    it(`Should remove a friend from the list`, () => {
      friendList.addFriends('Richard');
      expect(friendList.friends[0]).toBe(`Richard`);
      friendList.removeFriend('Richard');
      expect(friendList.friends[0]).toBeUndefined();
    });

    it(`Should throw an error when a friend is not found`, () => {
      expect(() => friendList.removeFriend('Richard')).toThrow(Error);
    });
  });
});
