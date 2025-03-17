const myPromise = new Promise<string>((resolve, reject) => {
    resolve('hello world')
    // reject('this rejection');
})

async function mid() {
    await myPromise;
    return 'hello midle';
}

export async function run() {
    try {
        const r = await mid();
        console.log('from run function', r);
    } catch (error) {
        console.log('from run function error:', error);
    }
}