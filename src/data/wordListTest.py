wordList_deliminator = ","
newList_deliminator = " "

# Loaded Word List
file = open("WORDLIST.js", "r")
contents = file.read()
file.close()
startIndex = contents.find("[")
endIndex = contents.find("]")
contents = contents[startIndex:endIndex].split(wordList_deliminator)
for i in range(len(contents)):
    contents[i] = contents[i].strip('"\n')


# New List to Check
file = open("testWords.txt", "r")
newWords = file.read()
file.close()
newWords = newWords.split(newList_deliminator)


# Test
for word in newWords:
    word = word.lower()
    if word not in contents:
        print(word)