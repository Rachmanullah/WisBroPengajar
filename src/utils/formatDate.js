export const formatDate = createdAt => {
    if (createdAt) {
        const createdAtDate = new Date(createdAt);
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        const year = createdAtDate.getFullYear();
        const month = months[createdAtDate.getMonth()];
        const day = createdAtDate.getDate();
        return `${month} ${day}, ${year}`;
    } else {
        return '';
    }
};