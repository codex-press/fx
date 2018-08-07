
To compile Snabbdom, clone its repository and run

    npm install
    npm run compile-es
    cd es
    rollup -f esm -i snabbdom.bundle.js -o bundle.js
    cp bundle.js ../fx/lib/snabbdom.js

