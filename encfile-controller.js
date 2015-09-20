var _ = require('underscore');
var encryptor = require('file-encryptor');

var ENC = 'encrypt';
var DEC = 'decrypt';
var DEFAULT_OPTIONS = {algorithm: 'aes256'};

function parseEncfile(encfile) {
    var jobs = [], i;
    var ops = [ENC, DEC];

    for (i in ops) {
        var op = ops[i];

        if (!encfile[op])
            continue;

        jobs = _.union(jobs, _.map(encfile[op], function(job) {
            if (_.isString(job))
                job = {input: job};

            job.mode = op;

            return job;
        }));
    }

    return _.without(_.map(jobs, function(job) {
        return resolveJob(job);
    }), null);
}

function resolveJob(job) {
    if (!job.input || !job.key)
        return null;

    if (!job.output) {
        if (job.mode === ENC)
            job.output = job.input + '.enc';
        else
            job.output = job.input + '.dec';
    }

    if (!job.options)
        job.options = DEFAULT_OPTIONS;

    return job;
}

function work(jobs, index) {
    if (index >= jobs.length)
        return console.log('[INFO] End of operation');

    var job = jobs[index];
    var func = job.mode === ENC ? 'encryptFile': 'decryptFile';

    encryptor[func](job.input, job.output, job.key, job.options, function(err) {
        if (err) {
            console.log('[ERROR] %s', err);
            work(jobs, index + 1);
        }

        console.log('[INFO] Operation completed successfully');
        console.log('[INFO] Output filename: %s', job.output);

        work(jobs, index + 1);
    });
}

module.exports = function() {
    try {
        var encfile = require('./encfile');
    } catch(exc) {
        return console.log('[ERROR] %s', exc);
    }

    var jobs = parseEncfile(encfile);

    work(jobs, 0);
}