cd change direcotory
mkdir  make directory
ls list 
pwd print working dirctdirectoryory
touch 

## ls 
The ls command lists all files and directories in the working directory.
-a - lists all contents, including hidden files and directories
-l - lists all contents of a directory in long format
drwxr-xr-x 4 fileOwner ownerGroup 172 Jul  8  2015 action
drwxr-xr-x 4 fileOwner ownerGroup  77 Jul  8  2015 comedy
drwxr-xr-x 4 fileOwner ownerGroup  38 Jul  8  2015 drama
-rw-r--r-- 1 fileOwner ownerGroup   0 Jul  8  2015 genres.txt
-t - order files and directories by the time they were last modified.

## cp 
copy file or directory

cp * newDir/
cp m*.txt newDir/
cp 1.txt 2.txt newDir/

## mv 
mv 1.txt 2.txt newDir/
mv 1.txt newDir/
mv 1.txt 2.txt  === rename


## rm 
rm -r means recursive, it's used to delete a directory and all of its child directories.There isn't an undelete command, so once you delete a file or directory with rm, it's gone.

# output input redirection

standard input, abbreviated as stdin, is information inputted into the terminal through the keyboard or input device.
standard output, abbreviated as stdout, is the information outputted after a process is run.
standard error, abbreviated as stderr, is an error message outputted by a failed process.
Redirection reroutes standard input, standard output, and standard error to or from a different location.

## > 
$ echo "Hello" > hello.txt
The > command redirects the standard output to a file. Here, "Hello" is entered as the standard input. The standard output "Hello" is redirected by > to the file hello.txt.

## cat
$ cat hello.txt
The cat command outputs the contents of a file to the terminal. When you type cat hello.txt, the contents of hello.txt are displayed.
cat命令的用途是连接文件或标准输入并打印。这个命令常用来显示文件内容，或者将几个文件连接起来显示，或者从标准输入读取内容并显示，它常与重定向符号配合使用。 

$ cat oceans.txt > continents.txt
'>' takes the standard output of the command on the left, and redirects it to the file on the right. Here the standard output of cat oceans.txt is redirected to continents.txt.
Note that > overwrites all original content in continents.txt. When you view the output data by typing cat on continents.txt, you will see only the contents of oceans.txt.

cat, echo 后面的内容, 应该是被当做是标准输入的数据, 然后, 如果后面没有 > 的重定位输出, 就会把内容标准输出, 如果有了重定位, 就会把内容输出到 > 指定的位置. 

## >> 
$ cat glaciers.txt >> rivers.txt
'>>' takes the standard output of the command on the left and appends (adds) it to the file on the right. You can view the output data of the file with cat and the filename.

## <
$ cat < lakes.txt  
 < takes the standard input from the file on the right and inputs it into the program on the left. Here, lakes.txt is the standard input for the cat command. The standard output appears in the terminal.

## |
$ cat volcanoes.txt | wc    
| is a "pipe". The | takes the standard output of the command on the left, and pipes it as standard input to the command on the right. You can think of this as "command to command" redirection.  
这个|到底什么意思呢, 就是前面的内容作为后面的参数. 
上面的这个命令, cat volcanoes.txt 的结果, 会作为wc命令的参数. 
$ cat volcanoes.txt | wc | cat > islands.txt  
而这个命令, cat volcanoes.txt 的结果, 作为wc的参数, wc的结果, 作为cat > islands.txt 的参数. 最终的结果, 就是将volcanoes.txt的行数, 字节数等信息(wc命令的功能), 输出到了islands.txt文件中. 
Multiple |s can be chained together. Here the standard output of cat volcanoes.txt is "piped" to the wc command. The standard output of wc is then "piped" to cat. Finally, the standard output of cat is redirected to islands.txt.

## sort
$ sort lakes.txt  
sort takes the standard input and orders it alphabetically for the standard output. Here, the lakes in sort lakes.txt are listed in alphabetical order.

$ cat lakes.txt | sort > sorted-lakes.txt
Here, the command takes the standard output from cat lakes.txt and "pipes" it to sort. The standard output of sort is redirected to sorted-lakes.txt.

## uniq
$ uniq deserts.txt
uniq stands for "unique" and filters out adjacent, duplicate lines in a file. Here uniq deserts.txt filters out duplicates of "Sahara Desert", because the duplicate of 'Sahara Desert' directly follows the previous instance. The "Kalahari Desert" duplicates are not adjacent, and thus remain.  
$ sort deserts.txt | uniq 
A more effective way to call uniq is to call sort to alphabetize a file, and "pipe" the standard output to uniq. Here by piping sort deserts.txt to uniq, all duplicate lines are alphabetized (and thereby made adjacent) and filtered out.
sort deserts.txt | uniq > uniq-deserts.txt
 Here we simply send filtered contents to uniq-deserts.txt, which you can view with the cat command.

 ## grep
$ grep Mount mountains.txt  
grep stands for "global regular expression print". It searches files for lines that match a pattern and returns the results. It is also case sensitive. Here, grep searches for "Mount" in mountains.txt. 
$ grep -i Mount mountains.txt 
grep -i enables the command to be case insensitive. Here, grep searches for capital or lowercase strings that match Mount in mountains.txt.
The above commands are a great way to get started with grep. If you are familiar with regular expressions, you can use regular expressions to search for patterns in files.  
$ grep -R Arctic /home/ccuser/workspace/geography  
grep -R searches all files in a directory and outputs filenames and lines containing matched results. -R stands for "recursive". Here grep -R searches the
/home/ccuser/workspace/geography directory for the string "Arctic" and outputs filenames and lines with matched results.

$ grep -Rl Arctic /home/ccuser/workspace/geography
grep -Rl searches all files in a directory and outputs only filenames with matched results. -R stands for "recursive" and l stands for "files with matches". Here grep -Rl searches the /home/ccuser/workspace/geography directory for the string "Arctic" and outputs filenames with matched results.

## sed
hard to use, overpass the command. 


# summrize 
Generalizations

Redirection reroutes standard input, standard output, and standard error.
The common redirection commands are:

'>' redirects standard output of a command to a file, overwriting previous content.
'>>' redirects standard output of a command to a file, appending new content to old content.
< redirects standard input to a command.
| redirects standard output of a command to another command.
A number of other commands are powerful when combined with redirection commands:

sort: sorts lines of text alphabetically.
uniq: filters duplicate, adjacent lines of text.
grep: searches for a text pattern and outputs it.
sed : searches for a text pattern, modifies it, and outputs it.










