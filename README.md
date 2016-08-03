# summernote-ext-wxemotions
summernote 微信表情扩展插件

使用方法

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>summernote - external-api</title>
    <!-- include jquery -->

    <!-- include libs stylesheets -->
    <link href="http://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    <link href="http://cdn.bootcss.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet">
    <!-- include summernote -->
    <link href="http://cdn.bootcss.com/summernote/0.8.1/summernote.css" rel="stylesheet">
    <link href="../src/css/summernote-ext-wxemotions.css" rel="stylesheet">

</head>

<body>
    <div class="container">
        <h1>summernote 微信表情扩展插件</h1>
        <div class="row">
            <div class="col-md-12">
                <div class="summernote"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 text-center">
                <button type="button" id="btn_setcode" class="btn btn-default ">设置</button>
                <button type="button" id="btn_getcode" class="btn btn-default ">获取</button>
            </div>
        </div>
        <div class="row" style="margin-top:20px;">
            <div class="col-md-12">
                <textarea name="code" id="code" rows="10" style="display:block;width:100%;"></textarea>
            </div>
        </div>
    </div>

    <script src="http://cdn.bootcss.com/jquery/2.2.4/jquery.min.js"></script>
    <script src="http://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="http://cdn.bootcss.com/summernote/0.8.1/summernote.min.js"></script>
    <script src="../src/js/summernote-ext-wxemotions.js"></script>
    <script type="text/javascript">
        var $summernote;
        $(document).ready(function() {
            $summernote = $('.summernote');

            // init summernote
            $summernote.summernote({
                height: 200,
                toolbar: [
                    ['btns_emoticon', ['wxemotions']],
                ],
                callbacks: {
                    onInit: function(e) {
                        var code = "<p>欢迎使用/示爱summernote 微信表情扩展插件/坏笑/强</p><p>/玫瑰/玫瑰/玫瑰/玫瑰/玫瑰/玫瑰/玫瑰/玫瑰/玫瑰/玫瑰/玫瑰/玫瑰/玫瑰/玫瑰<br></p>";
                        $(this).summernote("wxinit", code);
                    }
                }
            });
            $("#btn_setcode").click(function(e) {
                var code = $("#code").val();
                $summernote.summernote("code", code);
                $summernote.summernote("wxinit");
            });
            $("#btn_getcode").click(function(e) {
                var code = $summernote.summernote("wxcode");
                $("#code").val(code);
            });
        });
    </script>
</body>

</html>
