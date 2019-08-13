
# Order Api

# Create Order
Url: http://localhost:8001/api/order/create
Method: POST

Request Body: {
	"customerID": "CUST002",
	"details": "PARKER"
	}
}

Response Data: 
{
    "status": "SUCCESS",
    "data": {
        "status": "Created",
        "createdAt": "2019-08-13T04:14:51.198Z",
        "_id": "5d5239568ecf4a3e414fcdfd",
        "customerID": "CUST001",
        "details": "PARKER",
        "updatedAt": "2019-08-13T04:14:51.198Z",
        "__v": 0
    }
}

# Cancel Order
Url: http://localhost:8001/api/order/cancel

Method: PATCH

Request Body: {
    "id": "5d5220bce006a47709907a12"
}

Response Data: {
    "status": "SUCCESS",
    "data": {}
}

# Get Order Status
Url: http://localhost:8001/api/order/status/5d5239568ecf4a3e414fcdfd

Method: GET

Response Data: {
    "status": "SUCCESS",
    "data": {
        "status": "Cancelled"
    }
}
