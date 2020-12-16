<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
    <title>Login Page</title>
</head>
<body>
<style>
    section {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
<section>
		<div class="container">
			<div class="w-50 m-auto">
				<div class="card card-block">
				<div class="card-body">
					<h1 class="text-center text-capitalize ">Login</h1>
					<form class="mt-5" id="login">
					<div class="form-group">
						<label for="emp_id">Employee ID</label>
						<input type="text" id="email" name="emp_id" class="form-control" placeholder="Employee ID" autocomplete="off">
					</div>
					<div class="form-group">
						<label for="password">Password</label>
						<input type="password" id="password" name="password" class="form-control" placeholder="Password">
					</div>
					<div class="form-group form-check">
						<label class="form-check-label"></label>
						<input class="form-check-input" type="checkbox">Remember Me
					</div>
					<button class="btn btn-primary" type="submit">Login</button>
					</form>
				</div>
				</div>
			</div>
		</div>
	</section>
</body>
</html>