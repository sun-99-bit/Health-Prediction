from rest_framework.decorators import api_view
from rest_framework.response import Response
from myapp.ML.ml import predict_health


@api_view(["POST"])
def health_predict(request):
    try:
        data = request.data
        print("Incoming data:", data)

        result = predict_health(data)
        print(result)

        return Response(result, status=200)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=500
        )
