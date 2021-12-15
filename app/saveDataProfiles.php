<?php 

    $conx = mysqli_connect('localhost','root','','bd_scrap_linkedin'); 
    
    $dataProfiles = json_decode($_POST['data'], true);


    $query = "INSERT INTO tb_register(information_register, date_register) VALUES ('".$dataProfiles."',NOW())";    
    $result = mysqli_query($conx, $query);

    if($result){
        $array_rpta = array('status' => true,'msg' => 'Data registrada con éxito en nuestra BD');
    }else{
        $array_rpta = array('status' => false, 'msg' => 'Ocurrió un error en el servidor');
    }

    echo json_encode($array_rpta);


?>