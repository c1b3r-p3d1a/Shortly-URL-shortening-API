$(function () {
    const form = $("#shorten-form");
    const inputField = $("#input-field");
    const shortenLink = $('.shorten-link');

    const storedLink1 = localStorage.getItem("shortLink1");
    const storedLink2 = localStorage.getItem("shortLink2");
    const originalLink = localStorage.getItem("originalLink");
    if (storedLink1 && storedLink2 && originalLink) {
        inputField.val(originalLink);
        shortenLink.append(`
            <div style="display: flex; align-items: center; justify-content: center;">
                <div style="background-color: white; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25); width: 50%; display: flex; border-radius: 5px;">
                    <p style="flex-grow: 1; margin-right: 10px"><b>${storedLink1}</b></p>
                    <button class="url-cp-btn">Copy</button>
                </div>
            </div>
                    
            <div style="display: flex; align-items: center; justify-content: center; margin-top: 25px">
                <div style="background-color: white; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25); width: 50%; display: flex; border-radius: 5px;">
                    <p style="flex-grow: 1; margin-right: 10px"><b>${storedLink2}</b></p>
                    <button class="url-cp-btn">Copy</button>
                </div>
            </div>
        `);
        $(".url-cp-btn").click(function () {
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val($(this).prev().text()).select();
            document.execCommand("copy");
            $temp.remove();
            $(this).css("background-color", "hsl(257, 27%, 26%)");
            $(this).css("font-weight", "500");
            $(this).text("Copied!");
        });
    }

    form.submit(function (event) {
        if (!inputField.val()) {
            event.preventDefault();
            $(inputField).css("border", "1px solid red");
            $("#error-message").text("Please add a link").show();
        } else {
            $(inputField).css("border", "");
            $("#error-message").hide();
            fetch("https://api.shrtco.de/v2/shorten?url=" + inputField.val())
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error recuperating the data');
                    }
                    return response.json();
                })
                .then(data => {
                    const result = data.result;
                    const full_short_link = result.full_short_link;
                    const full_short_link2 = result.full_short_link2;

                    shortenLink.append(`
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <div style="background-color: white; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25); width: 50%; display: flex; border-radius: 5px;">
                                <p style="flex-grow: 1; margin-right: 10px"><b>${full_short_link}</b></p>
                                <button class="url-cp-btn">Copy</button>
                            </div>
                        </div>
                  
                        <div style="display: flex; align-items: center; justify-content: center; margin-top: 25px">
                            <div style="background-color: white; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25); width: 50%; display: flex; border-radius: 5px;">
                                <p style="flex-grow: 1; margin-right: 10px"><b>${full_short_link2}</b></p>
                                <button class="url-cp-btn">Copy</button>
                            </div>
                        </div>
                    `);
                    localStorage.setItem("shortLink1", full_short_link);
                    localStorage.setItem("shortLink2", full_short_link2);
                    localStorage.setItem("originalLink", inputField.val());

                    $(".url-cp-btn").click(function() {
                        var $temp = $("<input>");
                        $("body").append($temp);
                        $temp.val($(this).prev().text()).select();
                        document.execCommand("copy");
                        $temp.remove();
                        $(this).css("background-color", "hsl(257, 27%, 26%)");
                        $(this).css("font-weight", "500");
                        $(this).text("Copied!");
                    });
                })
                .catch(error => {
                    console.error(error);
                });
            event.preventDefault();
        }
    });
})