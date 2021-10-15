const quoteRegex = /\[(quote author=)([a-zA-Z0-9\-\_]+)\](.+)(\[\/quote\])/g;

module.exports = {
    parseBattlecode(battlecodeText) {
        battlecodeText = battlecodeText.split("[b]").join("<b>");
        battlecodeText = battlecodeText.split("[i]").join("<i>");
        battlecodeText = battlecodeText.split("[sup]").join("<sup>");
        battlecodeText = battlecodeText.split("[sub]").join("<sub>");
        battlecodeText = battlecodeText.split("[/b]").join("</b>");
        battlecodeText = battlecodeText.split("[/i]").join("</i>");
        battlecodeText = battlecodeText.split("[/sup]").join("</sup>");
        battlecodeText = battlecodeText.split("[/sub]").join("</sub>");
        battlecodeText = battlecodeText.split("\r\n").join("<br>");
        battlecodeText = battlecodeText.replace(quoteRegex, "</span><li class='list-group-item'></li><li class='list-group-item mb-3'>$3<br><div class='text-center mt-1'>$2</div></li><span>");

        return battlecodeText;
    },
    removeSpecialCharactersFromText(battlecodeText) {
        battlecodeText = battlecodeText.replaceAll("<", "");
        battlecodeText = battlecodeText.replaceAll(">", "");

        return battlecodeText;
    }
}