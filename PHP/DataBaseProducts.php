<?php

class DataBaseProducts{

    public $host, $user, $password, $db_name, $db_connection;

    function __construct($host,$user,$password,$db_name)
    {
        $this->host = $host;
        $this->user = $user;
        $this->password = $password;
        $this->db_name = $db_name;
        $this->db_connection = new mysqli($this->host,$this->user,$this->password,$this->db_name);
    }

    function getPasswords(){
        $sql = "SELECT * FROM passwords";
        $passwords = array();
        $result = $this->db_connection->query($sql);
        $count =0;
        while ($row = $result->fetch_assoc()){
            $passwords[$count] = $row;
            $count++;
        }
        return $passwords;
    }
}

?>