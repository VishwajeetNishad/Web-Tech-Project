<?php
header("Content-Type: application/json");

$data = [
  "message" => "Mock NIET Hostel Management data endpoint (no database)",
  "rooms" => 5,
  "students" => 3,
  "generated_at" => date("Y-m-d H:i:s")
];

echo json_encode($data, JSON_PRETTY_PRINT);
?>
