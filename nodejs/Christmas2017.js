const c_moduleIndex = 0;
let g_server;
let g_interval;

let g_running = false;
let g_index = 0;
let g_subindex = 0;

const c_animations = [
    {
        period: 500,
        frames: [
            [ 0, 0, 0, 0, 0, 0, 0, 0, ],
            [ 1, 0, 1, 0, 1, 0, 1, 0, ],
            [ 0, 1, 0, 1, 0, 1, 0, 1, ],
        ],
    },
    {
        period: 250,
        frames: [
            [ 0, 0, 0, 0, 0, 0, 0, 0, ],
            [ 1, 0, 1, 0, 1, 0, 1, 0, ],
            [ 0, 1, 0, 1, 0, 1, 0, 1, ],
        ],
    },
];

function init(server) {
    g_server = server;
}

function start() {
    g_running = true;
    g_index = 0;
    g_subindex = 0;
    setupInterval(0);
}

function stop() {
    g_running = false;
    if (g_interval) {
        clearImmediate(g_interval);
    }
}


async function body() {
    if (!g_running) {
        return;
    }

    if (g_index >= c_animations.length) {
        g_index = 0;
        return;
    }

    const animation = c_animations[ g_index ];
    if (g_subindex >= animation.frames.length) {
        g_subindex = 0;
        g_index++;
        return;
    }

    if (g_subindex === 0) {
        setupInterval(animation.period);
    }

    await write(animation.frames[ g_subindex++ ]);
}

function setupInterval(interval) {
    if (g_interval) {
        clearImmediate(g_interval);
    }

    g_interval = setInterval(body, interval);
}

async function write(frame) {
    for (let i = 0; i < frame.length; i++) {
        await g_server.core.setIO(c_moduleIndex, i, frame[ i ] === 1);
    }
}

module.exports.init = init;
module.exports.start = start;
module.exports.stop = stop;
