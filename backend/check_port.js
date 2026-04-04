const { exec } = require('child_process');
exec('netstat -ano | findstr :4000', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    const lines = stdout.split('\n');
    lines.forEach(line => {
        if (line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            console.log(`Process ID on 4000: ${pid}`);
            exec(`tasklist /FI "PID eq ${pid}"`, (err, out) => {
                console.log(out);
            });
        }
    });
});
