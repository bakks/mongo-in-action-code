library(zoo)

timings <- as.zoo(read.table("timings-mmapv1.conf.txt"))
timings <- merge.zoo(timings, as.zoo(read.table("timings-wiredtiger-uncompressed.conf.txt")))
timings <- merge.zoo(timings, as.zoo(read.table("timings-wiredtiger-snappy.conf.txt")))
timings <- merge.zoo(timings, as.zoo(read.table("timings-wiredtiger-zlib.conf.txt")))
colnames(timings) <- c("MMAPV1", "WT", "WT-snappy", "WT-zlib")
png("timings.png", width=7, height=5, res=300, units="in")
barplot(timings, beside=TRUE, col=c(2, 3, 4, 5))
legend("topright", legend=colnames(timings), fill = c(2, 3, 4, 5), bty="n")
title("Read performance", xlab="iteration", ylab="duration (s)")
dev.off()

write.csv(timings, file="timings.csv")
