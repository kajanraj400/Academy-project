<?php
	session_start();
	require 'configuration.php';

	if( isset( $_GET['details_id1']))
	{
		$details_id1=$_GET['details_id1'];
		$sql1 = "UPDATE Details SET role='admin' WHERE ID = '$details_id1'";
			
		if ($conn->query($sql1)) 
		{
			echo '<div class="container">'.
				 '<h1>Approved Successful</h1>'.
				 '<p>You approved him/her as an Admin!</p>'.
				 '<div class="redirect-message">'.
				 '<p>Redirecting you to the admin_panel page...</p>'.
				 '</div></div>';
		}
		else 
		{
			echo "Error approved: " . $conn->error;
		}
		
	}
	
	else if( isset( $_GET['details_id2']))
	{
		$details_id2=$_GET['details_id2'];
		$sql2 = "UPDATE Details SET role='guest' WHERE ID = '$details_id2'";
			
		if ($conn->query($sql2)) 
		{
			echo '<div class="container">'.
				 '<h1>Changed Successful</h1>'.
				 '<p>You changed him/her as an Guest!</p>'.
				 '<div class="redirect-message">'.
				 '<p>Redirecting you to the admin_panel page...</p>'.
				 '</div></div>';
		}
		else 
		{
			echo "Error Changed: " . $conn->error;
		}
	}
	
	else if( isset($_GET['apartment_ID']) && isset($_GET['Cardnumber']) )
	{
		$ApartmentId = $_GET['apartment_ID'];
		$Cardnumber = $_GET['Cardnumber'];
		
		$sql3 = "SELECT * FROM Apartments WHERE ID = '$ApartmentId'";
		$results3 = $conn->query($sql3);
		if ($results3->num_rows > 0) 
		{
			$row3 = $results3->fetch_assoc();				
			$Name = $row3["Name"];
			$OwnerName = $row3["OwnerName"];
			$OwnerNumber = $row3["OwnerNumber"];
			$Price = $row3["Price"];
			$Address = $row3["Address"];
		
			
			$sql4 = "INSERT INTO SOLD( Apartment_ID, Name, OwnerName, OwnerNumber, Address, Price, CardNumber ) VALUES( '$ApartmentId', '$Name', '$OwnerName', '$OwnerNumber', '$Address', '$Price', '$Cardnumber' )"; 
			if ( $conn->query($sql4) ) 
			{
				echo 'Inserted successfully';
			}
			
			$sql5 = "DELETE FROM Apartments WHERE ID = '$ApartmentId'";
			$sql6 = "DELETE FROM paymentdetails WHERE Cardnumber = '$Cardnumber'";
			if( $conn->query($sql6))
			{	
				if( $conn->query($sql5))
				{
					echo '<div class="container">'.
						 '<h1>Deleted Successful</h1>'.
						 '<p>You Deleted the Apartment Successfully!</p>'.
						 '<div class="redirect-message">'.
						 '<p>Redirecting you to the admin_panel page...</p>'.
						 '</div></div>';
				}
			}
		}
		
		else
		{
			echo "Error Deleting Apartment".$conn -> error;
		}
	}
	
	else
	{
		header('Location: admin_panel.php');
		exit();
	}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dession Success</title>
    <link rel="icon" href="images/icon.jpg">
	<style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 100px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h1 {
            color: #333;
        }

        p {
            color: #666;
        }

        .redirect-message {
            margin-top: 20px;
        }
    </style>
</head>
<body>	
	<script>
		setTimeout(function() {
			window.location.href = "admin_panel.php";
		}, 3000);
	</script>
</body>
</html>