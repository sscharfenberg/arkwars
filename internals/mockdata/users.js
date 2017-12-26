const crypto = require("crypto"); // https://nodejs.org/api/crypto.html

let users = [
    {
        _id: "597c523b7331ca2e2436b37f",
        salt:
            "de7b70502beb52eb4546d89dbb064f1268d439ba96469def2ffe79dd3a573793",
        hash:
            "c254ad94c54499a69c28a17485fd0ec758ba2996c9673f9f31f79aba65bf87cb067a8e6757d281b5085274f7fb6fadbadcee4a2c3bd0b7e74416ca410feb04d73c4fe123f159683bb4b9d85a186de59c6cc85eb93bf0a3b74f564aa386f45599ec24adeb1dfb3916478804de702c9344438ee519094c59122faf0e3c7cca57a070b7bb48de10b127784fab4fd7efe97547b5f3bd3e0fd8afeb5a66e1592bf935a388aca1cbc261a90044e1899496a79fc3a21121ef7ff2a8e2b12a7a238990ac0c49b273f2057258ab868577f9d5cc5b0d2cf015788248d4009440549dd930671c57720405780ebe750bdc75c28847a4405381f898bc0763221e31fa06c804ae53a5fb7ade8b33c88811b4b0729ac49f0edffbc28fcc7f2b0670f567a3a6dcaaebf3165164db4614b300aef51fe7e50ec2542670010ec62231e166eba62a8359e134fc3bf4b0f68665cb76df95570c3cbe8fe2dffdd0e455b8fb63b4b06fa99c346ee83a4091e124054f3f61c08406293ea627f114b968f54fe6eceb9de306624a9785f46dc3dce79b85b0968800d3577c373374f900a51bc50dfaee798cfb46b248d91e9199a89042c87c0c61e32a04e9eace6a653746c38f539711d096dcc79b6787c48528c344b635ae2be8d91f41ba9e0e62f319e99cd287f176af734d66b7d1276c0cf918e8bfab7cee15573b3af63cafc6bdb0007d79af7f964843d43e",
        email: "ashaltiriak@gmail.com",
        username: "Ash",
        locale: "de",
        emailConfirmed: true,
        suspended: false,
        selectedPlayer: "5990c7871e8258089436d748",
        attempts: 0,
        lastLogin: "2017-07-29T09:17:24.008Z",
        created: "2017-07-29T09:15:05.654Z",
        admin: true,
        mod: true,
        settings: { drawerOpen: true }
    }
];

const numRandomUsers = 100;

for (let i = 0; i < numRandomUsers; i++) {
    let user = {
        salt: "de7b70502beb52eb4546d89dbb064f1268d439ba96469def2ffe79dd3a573793",
        hash: "c254ad94c54499a69c28a17485fd0ec758ba2996c9673f9f31f79aba65bf87cb067a8e6757d281b5085274f7fb6fadbadcee4a2c3bd0b7e74416ca410feb04d73c4fe123f159683bb4b9d85a186de59c6cc85eb93bf0a3b74f564aa386f45599ec24adeb1dfb3916478804de702c9344438ee519094c59122faf0e3c7cca57a070b7bb48de10b127784fab4fd7efe97547b5f3bd3e0fd8afeb5a66e1592bf935a388aca1cbc261a90044e1899496a79fc3a21121ef7ff2a8e2b12a7a238990ac0c49b273f2057258ab868577f9d5cc5b0d2cf015788248d4009440549dd930671c57720405780ebe750bdc75c28847a4405381f898bc0763221e31fa06c804ae53a5fb7ade8b33c88811b4b0729ac49f0edffbc28fcc7f2b0670f567a3a6dcaaebf3165164db4614b300aef51fe7e50ec2542670010ec62231e166eba62a8359e134fc3bf4b0f68665cb76df95570c3cbe8fe2dffdd0e455b8fb63b4b06fa99c346ee83a4091e124054f3f61c08406293ea627f114b968f54fe6eceb9de306624a9785f46dc3dce79b85b0968800d3577c373374f900a51bc50dfaee798cfb46b248d91e9199a89042c87c0c61e32a04e9eace6a653746c38f539711d096dcc79b6787c48528c344b635ae2be8d91f41ba9e0e62f319e99cd287f176af734d66b7d1276c0cf918e8bfab7cee15573b3af63cafc6bdb0007d79af7f964843d43e",
        email: `${crypto.randomBytes(5).toString("hex")}@${crypto
            .randomBytes(5)
            .toString("hex")}.com`,
        username: "U" + i + "-" + crypto.randomBytes(5).toString("hex"),
        locale: Math.random > 0.5 ? "de" : "en",
        emailConfirmed: true,
        suspended: false,
        admin: false,
        mod: false,
        settings: { drawerOpen: true }
    };
    users.push(user);
}

module.exports = users;
