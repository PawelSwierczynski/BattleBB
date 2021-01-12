module.exports = {
    formatDate(dateString) {
        const date = new Date(dateString);

        const timezoneOffset = date.getTimezoneOffset() * 60000;
        
        const offsettedDate = new Date(date.getTime() - timezoneOffset);

        const offsettedDateStringParts = offsettedDate.toISOString().split("T");

        return offsettedDateStringParts[0] + " " + offsettedDateStringParts[1].substr(0, 8);
    }
}