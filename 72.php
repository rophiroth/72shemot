<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
 <head>
  <script type="text/javascript">
function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}
  </script>
  
  
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- anuncio adaptable -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-6282388945437284"
     data-ad-slot="2692738887"
     data-ad-format="auto"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
 </head>
<body>
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- 300x600 -->
<ins class="adsbygoogle"
     style="display:inline-block;width:300px;height:600px"
     data-ad-client="ca-pub-6282388945437284"
     data-ad-slot="4169472083"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
 </body>
</html>


<?php

$html= file_get_contents('https://www.myzmanim.com/day.aspx?askdefault=1&vars=57707569');


//libxml_use_internal_errors( true);
$doc = new DOMDocument;
$doc->loadHTML( $html);
$xpath = new DOMXpath( $doc);

// A name attribute on a <div>???
$query = $xpath->query( '//span');
$i=0;
$sunrise;
foreach ($query as $value) {
$ret=(strpos($value->textContent, 'Sunrise'));
if($ret!==false) 
{
	$sunrise=$i+4;
	//echo $sunrise." yeey enter!!";
}
//echo $ret;
//echo $value->textContent;
//echo " this is ".$i."<br />";
$i++;
}
//echo $sunrise." hola xd" ;
$node = $query->item( $sunrise );

//echo $node->textContent; // This will print **GET THIS TEXT** 

$hora=0;
$minuto=0;
if(isset($sunrise) || trim($sunrise)!=='')
{   
$a= explode(":", $node->textContent);
$hora=$a[0] + $_GET["gmt"];
$minuto=$a[1];
//echo $a[0]; // piece1
//echo $a[1]; // piece2
if($_GET["hora"] !==null){
    $hora = $_GET["hora"];    
}
}
echo "<script>post('https://www.72shemot.com/72shemot_meditaciones_resultado.php', {hora: ".($hora).",minuto: ".$minuto."}); </script>";
?>

