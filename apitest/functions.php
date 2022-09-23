<?php
function getParams()
{
    foreach ($_REQUEST as $key => $value) {
        $GLOBALS[$key] = trim($value);
    }
}
