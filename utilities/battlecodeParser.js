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

        return battlecodeText;
    },
    removeSpecialCharactersFromText(battlecodeText) {
        battlecodeText = battlecodeText.replaceAll("<", "");
        battlecodeText = battlecodeText.replaceAll(">", "");

        return battlecodeText;
    }
}