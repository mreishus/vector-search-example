#!env ruby
require 'json'

input_array = ARGV
if input_array.length < 1
  puts "#{$0}: How many words should I include in the model?"
  puts "Use \"./#{$0} 10000\" to make a 10,000 word model."
  exit
end

limit = ARGV.shift
if !(limit =~ /\A\d+\Z/)
  puts "#{$0}: Please provide a limit in numbers."
  puts "Use \"./#{$0} 10000\" to make a 10,000 word model."
  exit
end
limit = limit.to_i

puts "module.exports = {"
words_seen = {}
output_index = 0
File.open("./GoogleNews-vectors-negative300.txt", "r") do |file|
  file.each_with_index do |line, input_index|

    next if input_index == 0
    line_array = line.split
    word = line_array.shift.downcase

    next if words_seen.key?(word)
    words_seen[word] = 1

    vectorPart = line_array.join(", ")

    puts "#{JSON.generate(word)}: [#{vectorPart}],"
    output_index += 1
    break if output_index >= limit
  end
end
puts "};"
