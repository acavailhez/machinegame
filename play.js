function play(state) {
    // set all things
    var charges = makeBucket(state.charges);
    var otherRobots = makeBucket(state.players[0].robots);
    var robots = makeBucket(state.robots, 2, 6);
    var flag = state.players[0].flag;
    for (var r = 0; r < state.robots.length; r++) {
        var robot = state.robots[r];
        // In order:
        // 1. If other robot distance 1, attack
        // 2. If flag visible, blietz
        // 3. If <256 and enough charges, clone
        // 4. If charge nearby grab
        // 5. Move randomly
        var otherRobot = otherRobots.getNearest(robot);
        if (otherRobot) {
            if (distanceBetween(robot, otherRobot) <= 1) {
                robot.attack(otherRobot);
            } else {
                robot.moveTo(otherRobot);
            }
        } else if (flag && distanceBetween(robot, flag) <= 20) {
            robot.moveTo(flag);
        } else if (robot.charges >= 3 && state.robots.length < 256) {
            robot.clone();
        } else {
            var charge = charges.getNearest(robot, function (charge) {
                return !charge.robot;
            });
            if (charge) {
                charge.robot = robot;
                if (distanceBetween(robot, charge) <= 0) {
                    robot.collect();
                } else {
                    charge.robot = robot;
                    robot.moveTo(charge);
                }
            } else {
                // move where there are fewer robots
                var nearRobots = robots.getNear(robot);
                var maxDistance = -9999999;
                var bestMoves = [];
                for (var i = 0; i < MOVES.length; i++) {
                    var move = MOVES[i];
                    var newPt = {x: robot.x + move.x, y: robot.y + move.y};
                    var totalDistance = 0;
                    for (var j = 0; j < nearRobots.length; j++) {
                        var otherRobot = nearRobots[j];
                        totalDistance += distanceBetween(otherRobot, newPt);
                    }
                    totalDistance -= distanceBetween(state.flag, newPt);
                    if (totalDistance > maxDistance) {
                        maxDistance = totalDistance;
                        bestMoves = [newPt];
                    }
                    if (totalDistance === maxDistance) {
                        bestMoves.push(newPt);
                    }
                }
                // Chose a move at random
                var destination = bestMoves[randomBetween(0, bestMoves.length)];
                robot.moveTo(destination);
            }
        }
    }
}

var MOVES = [
    {x: -1, y: -1},
    {x: -1, y: 0},
    {x: -1, y: 1},
    {x: 0, y: -1},
    {x: 0, y: 1},
    {x: 1, y: -1},
    {x: 1, y: 0},
    {x: 1, y: 1},
];

function randomDestination(thing) {
    var dx = Math.floor(Math.random() * 7 - 3);
    var dy = Math.floor(Math.random() * 7 - 3);
    return {
        x: thing.x + dx,
        y: thing.y + dy,
    };
}

var botHeading = {}; // {[id] -> [quotient, denominator]}

function makeBucket(things, factor, side) {
    var bucket = new NineBuckets(factor, side);
    for (var i = 0; i < things.length; i++) {
        bucket.add(things[i]);
    }
    return bucket;
}

var NineBuckets = function (factor, SIDE) {
    factor = factor || 1;
    SIDE = SIDE || 4;
    var buckets = {};

    this.add = function (thing) {
        for (var i = -factor; i <= factor; i++) {
            for (var j = -factor; j <= factor; j++) {
                var x = Math.round(thing.x / SIDE) + i;
                var y = Math.round(thing.y / SIDE) + j;
                addToBucket(x, y, thing);
            }
        }
    }

    function addToBucket(i, j, thing) {
        if (!buckets[i]) {
            buckets[i] = {};
        }
        if (!buckets[i][j]) {
            buckets[i][j] = [];
        }
        buckets[i][j].push(thing);
    }

    function getFromBucket(i, j) {
        if (!buckets[i]) {
            return [];
        }
        if (!buckets[i][j]) {
            return [];
        }
        return buckets[i][j];
    }

    this.getNear = function (thing) {
        var things = [];
        var x = Math.round(thing.x / SIDE);
        var y = Math.round(thing.y / SIDE);
        things = getFromBucket(x, y);

        return things;
    }

    this.getNearest = function (thing, criterion) {
        var near = this.getNear(thing);
        var closest = null;
        var closestDistance = 999;
        var x = Math.round(thing.x / SIDE);
        var y = Math.round(thing.y / SIDE);
        for (var i = 0; i < near.length; i++) {
            var candidate = near[i];
            if (criterion && !criterion(candidate)) {
                continue;
            }
            var distance = distanceBetween(thing, candidate);
            if (distance < closestDistance) {
                closest = candidate;
                closestDistance = distance;
            }
        }
        return closest;
    }

}

function distanceBetween(a, b) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
};

function randomBetween(min, max) { // max not included
    return Math.floor(Math.random() * (max - min) + min);
}