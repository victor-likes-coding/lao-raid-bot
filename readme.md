# Lucy Bot Roadmap

## Commands
* `kick <user> [reason]` ✅
* `ban <user> [reason]` ✅
* `commands` ✅
* `server` ✅
* `play`: play song in current queue ❌
* `pause`: pauses song playing ❌
* `play [songName]`: looks up song name and adds it to the queue ❌
* `lock [channel] [reason] [duration=1d]`: locks a channel from being messaged in unless you're a mod (TODO: define mod) ❌
* `unlock [channel]` ❌
* `create_role <roleName>`: allows member to create roles, only owner can create roles with ban/kick permissions ❌
* `add_role <roleName> <user>[]`: adds a role to user(s) ❌
* `buy/sell <strike> <optionType> <price> [date] [amount=1]`: opens a `trade` object with details of the trade based on 1 contract, unless `amount` specified ✅
* `tp <tradeId> <price> [amount=1] [sl]`: issues a take profit of `price`, calculates the percentage in profit as well from average price ✅
* `avg <tradeId> <price> [amount=1]`: issues an average up/down, displays average based on buying 1 contract ✅ 
* `close <tradeId> <price>`: closes trade by `price`, calculates percentage based on average price. ✅
* `trim? <averagePrice> <amount=4>`: advises a good tp strategy

## interactions
* on `kick` command: member cannot kick another member that is:
    * another member with kick perms (unless owner) ✅
    * a bot ✅
    * themselves ✅
* on `ban` command: member cannot ban another member that is:
    * another member with ban perms (unless owner) ✅
    * a bot ✅
    * themselves ✅
* On message deletion:
  * store message in a deleted chat room ❌
* On internal errors: 
  * store message in error chat room ❌
* On `ban`/`kick`/`mute`/`unmute` commands: 
  * send message into mod log chat room ❌
* on `play [song]` command:
  * bot will suggest song and user can react by emoji whether to add or look at the next song to do the same ❌
  * user must be in voice channel to use command ❌
* `bot behavior`:
  * when all members leave voice channel bot is in, bot disconnects / stops playing ❌
* on `lock` command: `channel`, `reason`, and `duration` are optional, 
  * if `channel` is omitted, locks channel command was sent in for 1 day (default) ❌
* on `unlock` command: `channel` is optional
  * will unlock current channel if locked ❌
* on `create_role <roleName>` command: 
  * a list of roles will be displayed ❌
  * user may react to which roles to add to this role name ❌
* on `add_role <roleName> <user>[]` command: 
  * roles will be applied to one or more users ❌
* on `buy/sell` command: 
  * should notify members in analyst channel if play came from analyst ❌
  * should add play as a summary in gen chat or other chats ❌
  * trade should be stored for later reference in database ❌
  * add trade to a dashboard for member listing trades by order `tradeId` ❌
  * will keep track of open trades if user enters more than 1 amount (via `pt`, `avg`, `close` commands) ❌
* on `tp` command: 
  * if member only has 1 contract amount, will close order on dashboard ✅
  * if member has more than 1 contract, will subtract by 1 or given `amount` ✅
  * calculates profits based on raising sl to breakeven and multiply contracts closed by `price` ✅ 
  * shows percent of profit target vs average price (20%/40%/60%, etc) of profit target ✅
  * updates dashboard to show current profit % for trade ✅
* on `avg` command: 
  * calculates new average by assuming 1 contract or `amount` @ `price` ✅
* on `close` command: 
  * closes the remaining amount of contracts * `price` ✅ 
  * take trade off dashboard ✅
  * ❌ for loser or ✅ for winner ❌ 
* on `trim?` command: 
  * advise user on taking profits at 5%, 10%, 15%+ ❌ 
  * advise user to close 25%, 50%, and 25% respectively ❌ 
  * advise user to raise stop loss to BE (breakeven), 5%, 10% respectively ❌ 
  * shows profit targets based on `averagePrice` entered ❌ 
  * shows contracts to close with `4` (default) contracts or `amount` given ❌ 