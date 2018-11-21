// ng serve --configuration=local --open
export const environment = {
    chore: false,
    //  SERVER_URL: `http://172.31.200.36:3030/v1`,
    SERVER_URL: `http://localhost:3030/v1`,
    production: false,
    hmr: true, // 热替换是否开启
    useHash: false // 和热替换冲突，hmr为true时useHash为false
};
