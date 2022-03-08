//
// machinegame - a game where you code to play
//
// Your goal is to capture the other player's flag with your fleet of robots
// Each turn, your code is called and you can give one command to each robot

function play(state) {

  // "state" contains everything you need to play:
  // state = {
  //   robots: [    → an array of your robots
  //   { x, y,    → integers, the position of your robot on the grid
  //     charges }  → integer, the health of your robot
  //   ],
  //   charges: [     → an array of charges your robots can pick up
  //   {x, y}
  //   ],
  //   players: [     → what you can see from other players
  //   robots: [    → the other player's robots (those you can see)
  //     { x, y,    → the position of the robot
  //     charges }  → the health of the robot
  //   ],
  //   flag: { x, y } → the other player's flag, if you already found it
  //   ]
  // }
  //
  // Let's pick the first robot:

  var robot = state.robots[0];

  // You can give one of 4 instructions to your robot:
  //
  // 1. robot.moveTo({x: 4, y: 4})
  //  The robot attempt to move to that position on the grid, one step each
  //  turn, including diagonally (like a king in chess)
  //  Robots cannot move to a position occupied by another player's robot.
  //
  // 2. robot.collect()
  //  The robot will attempt to pickup a charge on the ground
  //  if successful, it will increment the robot.charge
  //
  //  3. robot.clone()
  //   If the robot has 3 or more charges, spend 2 to create a new robot
  //   There is a maximum of 256 robots per player
  //
  //  4. robot.attack(another_robot)
  //   If your robot is 1 step from another robot (including diagonal), it
  //   can smite them and remove 1 charge from them. If a robot reaches 0
  //   charges, it drops dead
  //
  //  You win when one of your robot is on another player flag.
  //
  //  Let's move our robot to a visible charge and collect it:

  var charge = state.charges[0];
  if (charge.x === robot.x && charge.y === robot.y){
    robot.collect();
  }
  else{
    robot.moveTo(charge);
  }

  // Change the `play` function so it handles any state and gives instructions
  // to your robots to move, collect charges, clone, attack and defend, and
  // ultimately capture the other player's flag.

  // The [⏯] button will play one turn only. The [⏩] button will play until the
  // game ends
}