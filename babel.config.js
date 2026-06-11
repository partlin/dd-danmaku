const env = process.env.BROWSERSLIST_ENV || 'android9';

const targets =
    env === 'android7'
        ? { android: '7' }
        : { android: '9', chrome: '73' };

module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: false,
                targets,
                exclude: [
                    '@babel/plugin-transform-regenerator',
                    '@babel/plugin-transform-async-to-generator',
                ],
            },
        ],
    ],
};
