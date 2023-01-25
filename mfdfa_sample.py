import requests
from bs4 import BeautifulSoup
import smtplib

# Define the URLs for the online stores in the US, UK, and France
urls = {'US': 'https://www.hermes.com/us/en/category/women/bags-and-small-leather-goods/bags-and-clutches/#|',
        'UK': 'https://www.hermes.com/uk/en/category/women/bags-and-small-leather-goods/bags-and-clutches/#|',
        'HK': 'https://www.hermes.com/hk/en/category/women/bags-and-small-leather-goods/bags-and-clutches/#|'
        }

# Scrape the products from the online store
product_list = []
for region, url in urls.items():
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    products = soup.find_all('div', class_='product-card')
    for product in products:
        name = product.find('div', class_='product-card__title').text
        price = product.find('div', class_='product-card__price').text
        product_list.append({'name': name, 'price': price, 'region': region})

# Send the product list as a table through email
table = '<table><tr><th>Name</th><th>Price</th><th>Region</th></tr>'
for product in product_list:
    table += '<tr>'
    table += '<td>' + product['name'] + '</td>'
    table += '<td>' + product['price'] + '</td>'
    table += '<td>' + product['region'] + '</td>'
    table += '</tr>'
table += '</table>'