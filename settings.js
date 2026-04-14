const SCIENTIFIC = 'Scientific notation';
const STANDARD = 'Standard notation';
const NOTATIONS = [SCIENTIFIC, STANDARD];

const settings = {
    numberDisplay: STANDARD
}

function switchNotation() {
    settings.numberDisplay = NOTATIONS[(NOTATIONS.findIndex(notation => notation == settings.numberDisplay)+1) % NOTATIONS.length];
}