const quoteRegex = /\[(quote author=)([a-zA-Z0-9\-\_]+)\](.+)(\[\/quote\])/g;

module.exports = {
    parseBattlecode(battlecodeText) {
        battlecodeText = battlecodeText.replaceAll("[b]", "<b>");
        battlecodeText = battlecodeText.replaceAll("[i]", "<i>");
        battlecodeText = battlecodeText.replaceAll("[sup]", "<sup>");
        battlecodeText = battlecodeText.replaceAll("[sub]", "<sub>");
        battlecodeText = battlecodeText.replaceAll("[/b]", "</b>");
        battlecodeText = battlecodeText.replaceAll("[/i]", "</i>");
        battlecodeText = battlecodeText.replaceAll("[/sup]", "</sup>");
        battlecodeText = battlecodeText.replaceAll("[/sub]", "</sub>");
        battlecodeText = battlecodeText.replaceAll("\r\n", "<br>");
        battlecodeText = battlecodeText.replaceAll(quoteRegex,
            "</span> \
            <li class=\"list-group-item\"></li> \
            <li class=\"list-group-item mb-3\"> \
                $3 \
                <br><div class=\"text-center mt-1\">$2</div> \
            </li> \
            <span>");

        return battlecodeText;
    },
    removeSpecialCharactersFromText(battlecodeText) {
        battlecodeText = battlecodeText.replaceAll("<", "");
        battlecodeText = battlecodeText.replaceAll(">", "");

        return battlecodeText;
    }
}