import json
 
f = open('cinemaATP.json') 

data = json.load(f)

# ordem alfabética
data = sorted(data, key=lambda k: k['title'])

# pagina html para cada regista
i = 1
for film in data:
    file = open('f' + str(i) + '.html', 'w')
    content = '''<!DOCTYPE html>
       <html>
           <head> 
               <meta charset="UTF-8"/>
           </head>
           <body> 
               <h1>Name: ''' + film["title"] +'''</h1>'''
    content = content + ''' <h2>Year: ''' + str(film["year"]) + ''' </h2>'''
    content = content + ''' <h3>Cast: </h3>'''           
    for cast in film["cast"]:
        content = content + '''
                   <ul>
                       <li>''' + cast + '''
                      </li>
                </ul>'''
    content = content + ''' <h3>Genres: </h3>'''   
    for genre in film["genres"]:
        content = content + '''
                   <ul>
                       <li>''' + genre + '''
                      </li>
                </ul>'''
           
    content = content + '''</body>
       </html>''' 
    i = i + 1
    file.write(content)
    f.close()
   
# criar a lista por título 
file = open('index.html', 'w') 

i = 1
content = '''<!DOCTYPE html>
       <html>
           <head> 
               <meta charset="UTF-8"/>
           </head>
           <body> 
               <h1> Filmes </h1>'''
for film in data:
    content = content + '''
               <ul>
                   <li>
                       <a href="http://localhost:7777/filmes/f''' + str(i) + '''">'''+ film["title"]+'''</a> 
                   </li>
               </ul>'''
    i = i + 1 
           
content = content + '''</body>
       </html>'''   

file.write(content)
f.close()