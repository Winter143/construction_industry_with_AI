from flask_restful import Resource, reqparse
from .cpmrunner import CPMRunner


class CPM(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('cpm_data',
                        type=dict,
                        required=True,
                        help="This field cannot be left blank!")

    def post(self, name):
        data = CPM.parser.parse_args()
        data = data['cpm_data']
        cpmrunner = CPMRunner(name, data)
        cpmrunner.run()
        return {'message': 'success', 'data': data}, 201
