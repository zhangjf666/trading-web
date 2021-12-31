
var util = {
    /**
     * 格式化日期为yyyy-MM-dd字符串
     * @param {Date} date 
     * @returns 
     */
    formatDate: function(date) {
        var y = date.getFullYear();  
        var m = date.getMonth() + 1;  
        m = m < 10 ? '0' + m : m;  
        var d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        return y + '-' + m + '-' + d;  
    }
}

export default util