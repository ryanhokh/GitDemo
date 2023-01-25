from flask import Flask, jsonify, request
import pandas as pd
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/stock-risk', methods=['GET'])
def stock_risk():
    stock_name = request.args.get('stock_name')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    if stock_name is None:
        return jsonify({"error": "stock_name parameter is required"}), 400
    try:
        data = yf.download(stock_name)
        data.index = data.index.strftime('%Y-%m-%d')
        data = data[(data.index >= start_date) & ((data.index <= end_date))]
    except:
        return jsonify({"error": "Invalid stock name"}), 400
    return jsonify({"data": data.to_dict()})

if __name__ == '__main__':
    app.run()