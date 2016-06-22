/**
 * Created by karl on 2016/4/22.
 */
class math {

    /**
     * build a random int from 0 to max
     * @param max
     * @returns {number}
     */
    static buildRandom(max) {
        let random = Math.round(Math.random() * max);
        return random;
    } 
} 