/**
 * Created by Nathan P on 1/31/14.
 *
 * A console wrapper (capstone console)
 * This encourages log tagging so we know which scripts print statements
 * are coming from.
 */

define({
    log: function(tag, msg) {
        console.log(tag + " : " + msg);
    }
});
