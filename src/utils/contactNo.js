
const generateContactNumber = () => {
    const number = Date.now().toString().slice(-10);
    return `e${number}`;
};
export default generateContactNumber;